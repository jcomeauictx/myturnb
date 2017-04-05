SERVICE := myturn
BACKEND := node-$(SERVICE)-api
NGINX_CONFIG := /etc/nginx
SITE_ROOT := /var/www/myapp/code
SITE_CONFIG := $(NGINX_CONFIG)/sites-available/$(SERVICE)
SITE_ACTIVE := $(NGINX_CONFIG)/sites-enabled/$(SERVICE)
TIMESTAMP := $(shell date +%Y%m%d%H%M%S)
DRYRUN ?= --dry-run  # for rsync
export
install: /etc/rc2.d/S01$(BACKEND) $(SITE_ACTIVE) startup_service restart_nginx
siteinstall: ~/src/myturnb | $(SITE_ROOT)
	rsync -avuz $(DRYRUN) --exclude=configuration $</ $(SITE_ROOT)/
/etc/init.d/%: %
	[ -e "$@" ] && diff -q $< $@ || sudo mv $@ $@.$(TIMESTAMP)
	[ -e "$@" ] || sudo cp $< $@
/etc/rc2.d/S01%: /etc/init.d/%
	sudo update-rc.d $* enable
startup_service: /etc/init.d/$(BACKEND)
	sudo $< start
$(SITE_ROOT):
	sudo mkdir -p $@
$(SITE_ACTIVE): $(SITE_CONFIG)
	cd $(dir $@) && sudo ln -sf ../sites-available/$(notdir $<) .
$(SITE_CONFIG): myturn.nginx
	[ -e "$@" ] && diff -q $< $@ || sudo mv $@ $@.$(TIMESTAMP)
	[ -e "$@" ] || sudo cp $< $@
restart_nginx: /etc/init.d/nginx
	sudo $< restart
diff:
	diff -r -x '.git*' .. /var/www/myapp/code
