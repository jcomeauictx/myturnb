install:
	# first make sure `/usr/bin/env node` returns a valid path
	if [ -z "$$(which node)" ]; then \
	 ln -sf $$(which nodejs) $$(dirname $$(which nodejs))/node; \
	fi
	@echo Installing MyTurn from $(PWD)
	cd configuration && $(MAKE) DRYRUN= env siteinstall install
public/favicon.ico: public/resources/images/icons/myturn-logo.png .FORCE
	convert $< -crop 144x144+0+20 -define icon:auto-resize=64,48,32,16 $@
.FORCE:
