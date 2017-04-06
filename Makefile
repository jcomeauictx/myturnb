install:
	# first make sure `/usr/bin/env node` returns a valid path
	$$(which node) || \
	 sudo ln -sf $$(which nodejs) $$(dirname $$(which nodejs))/node
	echo Installing MyTurn from $(PWD)
	cd configuration && $(MAKE) DRYRUN= siteinstall install
