install: dependencies
	echo Installing MyTurn from $(PWD)
	cd configuration && $(MAKE) DRYRUN= siteinstall install
dependencies:
	$$(which forever) || sudo apt-get install node-forever-agent
