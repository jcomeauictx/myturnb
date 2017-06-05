SHELL := /bin/bash
NODE_ENV := $(shell node -e \
 'process.stdout.write(JSON.stringify(process.env))')
NPM_CONFIG_ARGV := $(shell node -e \
 'process.stdout.write(process.env.npm_config_argv)')
PACKAGE := $(shell node -e \
 'process.stdout.write(JSON.parse(process.env.npm_config_argv)["remain"][0])')
BRANCH := $(shell echo $(PACKAGE) | cut -d\# -f2)
# we're only interested in specially named branches, to determine port number
BRANCH := $(findstring $(BRANCH), alpha beta baseline)
ifeq ($(strip $(BRANCH)),)
 BRANCH := release
endif
SERVICE := myturn-$(BRANCH)
BACKEND := myturn@$(BRANCH)
ALPHA_PORT := 3004
BETA_PORT := 3003
BASELINE_PORT := 3002
RELEASE_PORT := 3001
LEGACY_PORT := 3000
SERVER_PORT := $($(shell echo $(BRANCH) | tr a-z A-Z)_PORT)
NGINX_CONFIG := /etc/nginx
SITE_ROOT := /var/www/$(SERVICE)
SITE_CONFIG := $(NGINX_CONFIG)/sites-available/$(SERVICE)
SITE_ACTIVE := $(NGINX_CONFIG)/sites-enabled/$(SERVICE)
TIMESTAMP := $(shell date +%Y%m%d%H%M%S)
DRYRUN ?= --dry-run  # for rsync
DELETE ?= --delete
export
set env:
	$@
install: /etc/systemd/system/myturn@$(BRANCH).service $(SITE_ACTIVE) \
 restart_$(BACKEND) restart_nginx
/etc/systemd/system/%: /tmp/%
	mv -f $< $@
/tmp/myturn@%.service: myturn@.service .FORCE
	cp -f $< $@
	sed -i "s/$(LEGACY_PORT)/$(SERVER_PORT)/" $@
siteinstall: | $(SITE_ROOT)
	cd .. && rsync -avcz $(DRYRUN) $(DELETE) \
	 --exclude=configuration --exclude='.git*' \
	 . $(SITE_ROOT)/
$(SITE_ROOT):
	mkdir -p $@
$(SITE_ACTIVE): $(SITE_CONFIG)
	cd $(dir $@) && ln -sf ../sites-available/$(notdir $<) .
/tmp/$(SERVICE).nginx: myturn.nginx .FORCE
	cp -f $< $@
	sed -i -e "s/$(LEGACY_PORT)/$(SERVER_PORT)/" \
	 -e "s/legacy/$(BRANCH)/g" \
	 $@
	# "production" branch replaces legacy installation for "myturn.mobi"
	if [ "$(BRANCH)" = "production" ]; then \
	 sed -i 's/production[.]//' $@; \
	 rm -f /etc/nginx/sites-enabled/myturn; \
	fi
$(SITE_CONFIG): /tmp/$(SERVICE).nginx
	if [ -e "$@" ]; then \
	 if diff -q $< $@; then \
	  echo $@ unchanged >&2; \
	 else \
	  echo Saving $@ to $@.$(TIMESTAMP) >&2; \
	  mv $@ $@.$(TIMESTAMP); \
	 fi; \
	fi
	[ -e "$@" ] || mv $< $@
restart_%:
	-systemctl stop $*
	systemctl daemon-reload  # in case configuration changed
	systemctl enable $*
	systemctl start $*
diff:
	diff -r -x '.git*' .. /var/www/$(SERVICE)
.FORCE:
