Ext.define('testing.util.UrlUtils', {
	/* I don't know the purpose of this routine, but it was hard-coding
	 * the URL to http://myturn.mobi/ and this was causing problems
	 * with my testing on other servers. So I changed it. Hopefully
	 * I haven't broken some needed functionality -- jc@unternet.net */
	singleton: true,
	getBaseUrl: function() {
		var url = "http://localhost:3000/";
		var isNative = EnvUtils.isNative();
		var baseUrl = location.href.substring(0, location.href.lastIndexOf("/") + 1);
		if (isNative || (baseUrl != "http://localhost/")) url = baseUrl;
		return url;
	}
});
