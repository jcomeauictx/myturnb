Ext.define('testing.util.EnvUtils', {
	alternateClassName: 'EnvUtils',
	singleton: true,
	isNative: function() {
		var result = typeof(device) !== 'undefined' && device && device.name;
		if (result) console.log("isNative() set to true for " + device.name);
		return result;
	}
});
