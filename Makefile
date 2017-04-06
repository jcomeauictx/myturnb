install:
	echo Installing MyTurn from $(PWD)
	cd configure && $(MAKE) DRYRUN= siteinstall install
