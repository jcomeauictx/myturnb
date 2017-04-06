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
install: /etc/rc2.d/S01$(BACKEND) $(SITE_ACTIVE) startup_service restart_nginx
siteinstall: | $(SITE_ROOT)
	cd .. && sudo rsync -avcz $(DRYRUN) $(DELETE) \
	 --exclude=configuration --exclude='.git*' \
	 . $(SITE_ROOT)/
/etc/init.d/%: %
	if [ -e "$@" ] && diff -q $< $@; then sudo mv $@ $@.$(TIMESTAMP); fi
	[ -e "$@" ] || sudo cp $< $@
/etc/rc2.d/S01%: /etc/init.d/%
	sudo update-rc.d $* defaults
startup_service: /etc/init.d/$(BACKEND)
	sudo $< restart
$(SITE_ROOT):
	sudo mkdir -p $@
$(SITE_ACTIVE): $(SITE_CONFIG)
	cd $(dir $@) && sudo ln -sf ../sites-available/$(notdir $<) .
$(SITE_CONFIG): myturn.nginx
	if [ -e "$@" ] && diff -q $< $@; then sudo mv $@ $@.$(TIMESTAMP); fi
	[ -e "$@" ] || sudo cp $< $@
restart_nginx: /etc/init.d/nginx
	sudo $< restart
diff:
	diff -r -x '.git*' .. /var/www/myturn
