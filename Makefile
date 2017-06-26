alphatest:
	NODE_PATH=/usr/local/lib/node_modules/myturn/node_modules \
	 SERVER_PORT=3004 \
	 node api.js --local
install:
	# first make sure `/usr/bin/env node` returns a valid path
	if [ -z "$$(which node)" ]; then \
	 ln -sf $$(which nodejs) $$(dirname $$(which nodejs))/node; \
	fi
	@echo Installing MyTurn from $(PWD)
	cd configuration && $(MAKE) DRYRUN= set siteinstall install
public/favicon.ico: public/resources/images/icons/myturn-logo.png .FORCE
	convert $< -crop 144x144+0+20 -define icon:auto-resize=64,48,32,16 $@
diff:
	git diff -w -b dee24fa4
.FORCE:
