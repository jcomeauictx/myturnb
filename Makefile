install:
	echo Installing MyTurn from $(PWD)
	cd configuration && $(MAKE) DRYRUN= siteinstall install
