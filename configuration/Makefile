SERVICE := myturn
BACKEND := node-$(SERVICE)-api
NGINX_CONFIG := /etc/nginx
SITE_ROOT := /var/www/myturn
SITE_CONFIG := $(NGINX_CONFIG)/sites-available/$(SERVICE)
SITE_ACTIVE := $(NGINX_CONFIG)/sites-enabled/$(SERVICE)
TIMESTAMP := $(shell date +%Y%m%d%H%M%S)
DRYRUN ?= --dry-run  # for rsync
DELETE ?= --delete
export
set env:
	$@
install: /etc/rc2.d/S01$(BACKEND) $(SITE_ACTIVE) startup_service restart_nginx
siteinstall: | $(SITE_ROOT)
	cd .. && rsync -avcz $(DRYRUN) $(DELETE) \
	 --exclude=configuration --exclude='.git*' \
	 . $(SITE_ROOT)/
/etc/init.d/%: %
	if [ -e "$@" ]; then \
	 if diff -q $< $@; then \
	  echo $@ unchanged >&2; \
	 else \
	  echo Saving $@ to $@.$(TIMESTAMP) >&2; \
	  mv $@ $@.$(TIMESTAMP); \
	 fi; \
	fi
	[ -e "$@" ] || cp $< $@
/etc/rc2.d/S01%: /etc/init.d/%
	update-rc.d $* defaults
startup_service: /etc/init.d/$(BACKEND)
	$< restart
$(SITE_ROOT):
	mkdir -p $@
$(SITE_ACTIVE): $(SITE_CONFIG)
	cd $(dir $@) && ln -sf ../sites-available/$(notdir $<) .
$(SITE_CONFIG): myturn.nginx
	if [ -e "$@" ]; then \
	 if diff -q $< $@; then \
	  echo $@ unchanged >&2; \
	 else \
	  echo Saving $@ to $@.$(TIMESTAMP) >&2; \
	  mv $@ $@.$(TIMESTAMP); \
	 fi; \
	fi
	[ -e "$@" ] || cp $< $@
restart_nginx: /etc/init.d/nginx
	$< restart
diff:
	diff -r -x '.git*' .. /var/www/myturn
