// client side code

// initialize vibration API for older browsers
navigator.vibrate = navigator.vibrate || 
    navigator.webkitVibrate || 
    navigator.mozVibrate || 
    navigator.msVibrate ||
    (navigator.notification ? navigator.notification.vibrate : undefined);
// but get rid of false desktop Chrome support -- it can't really vibrate
if (!navigator.userAgent.match(/(Mobi|SCH-I800)/)) {
    console.log("desktop browser " + navigator.userAgent +
                ": disabling vibration");
    navigator.vibrate = undefined;
}
console.log("vibration enabled: " + navigator.vibrate);

Ext.define('testing.controller.Discussion', {
    extend: 'Ext.app.Controller',
    requires: [
        'testing.util.UrlUtils',
        'testing.util.TimeUtils', 
        'Ext.device.Notification'
    ],
    config: {
        beepUrl: 'resources/sounds/beep.mp3',
        tickUrl: 'resources/sounds/tick.mp3',
        introUrl: 'resources/sounds/sax4.mp3',
        nativeTickSound: null,
        nativeBeepSound: null,
        nativeIntroSound: null,
        refs: {
            mainView: "mainView",
            discussionView: "discussionView",
            userReportView: "userReportView",
            addToQueueButton: "button[action=addToQueueEvent]",
            messageLabel: "#messageLabel",
            timeRemainingLabel: "#timeRemainingLabel",
            beepSound: "#beeper",
            tickSound: "#ticker",
            introSound: "#intro"
        }
    },

    doAddToQueue: function () {
        this.getApplication().fireEvent('clientMessage', { type: 'requestToSpeak' });
    },

    doRemoveFromQueue: function () {
        this.getApplication().fireEvent('clientMessage', { type: 'relinquishTurn' });
    },

    doDiscussionOver: function (data) {
        console.log("flowdebug: doDiscussionOver()");
        this.clearTick();
        this.doIntro();  // sax solo at end
        Ext.Msg.alert('', 'The discussion is over.');
        // a group was deleted on server, time to reload
        Ext.getStore('groups').load();
        this.getUserReportView().doUsersSaved(data);
    },

    doUsersSaved: function(data) {
       console.log("flowdebug: doUsersSaved()");
       this.clearTick();
       this.initMessageScreen();
    },

    doNewSpeaker: function (data) {
        console.log("flowdebug: doNewSpeaker()");
        this.getMessageLabel().setHtml('Current speaker is ' + data.name);
        this.doUpdateTimeRemaining(data);
        if (this.getUserName() != data.name) {
            this.clearTick();
        }
    },

    doWaitingForNewSpeaker: function (data) {
        console.log("flowdebug: doWaitingForNewSpeaker()");
        this.getMessageLabel().setHtml('Waiting for New Speaker');
        this.doUpdateTimeRemaining(data);
        this.doBeep();
        this.clearTick();
    },

    getUserName: function () {
        var users = Ext.getStore('defaultUsers');
        if (users.getCount() == 1) {
            return users.getAt(0).get('name');
        }
        return null;
    },

    initMessageScreen: function () {
        console.log("flowdebug: initMessageScreen()");
        this.getMessageLabel().setHtml('Waiting for New Speaker');
        this.getTimeRemainingLabel().setHtml('');
    },

    clearTick: function () {
        if (this.tickSoundInterval) {
            clearInterval(this.tickSoundInterval);
            this.tickSoundInterval = null;
        }
    },

    doMyTurn: function (data) {
        if (this.tickSoundInterval) {
            return;
        }
        this.doBeep();
        var context = this;
        this.clearTick();
        this.tickSoundInterval = setInterval(function () {
            context.doTick();
        }, 1000);
    },
    
    crossPlatformPlay: function(soundObject) {
        var sound = soundObject.getUrl();
        console.log("playing " + sound);
        if (Audio) {
            console.log("using Audio API");
            new Audio(soundObject.getUrl()).play();
        } else if (EnvUtils.isNative()) {
            var url = testing.util.UrlUtils.getBaseUrl() + sound;
            var media = new Media(
                url, 
                function() {}, 
                function(err) { 
                    Ext.Msg.alert('media error: ' + err.message);
                }
            );
            media.play();
        } else {
            soundObject.play();
        }
    },
    
    doBeep: function() {
        console.log("doBeep()");
        if (navigator.vibrate) {
            console.log("vibrating 'beep'");
            navigator.vibrate(250);
        } else if (EnvUtils.isNative()) {
            this.getNativeBeepSound().play();
        } else {
            this.crossPlatformPlay(this.getBeepSound());
        }

    },
    
    doTick: function () {
        console.log("doTick()");
        if (navigator.vibrate) {
            console.log("vibrating 'tick'");
            navigator.vibrate(20);
        } else if (EnvUtils.isNative()) {
            this.getNativeTickSound().play();
        } else {
            this.crossPlatformPlay(this.getTickSound());
        }
    },

    doIntro: function () {
        if (EnvUtils.isNative()) {
            console.log("Playing native intro sound");
            this.getNativeIntroSound().play();
        } else {
            console.log("Playing intro sound");
            this.crossPlatformPlay(this.getIntroSound());
        }
    },

    doUpdateTimeRemaining: function (data) {
        var formattedTime = testing.util.TimeUtils.getFormattedTime(data.timeLeft);
        this.getTimeRemainingLabel().setHtml(formattedTime);
    },

    doInitSession: function() {
        this.doIntro();
    },

    init: function () {
        console.log("flowdebug: init()");
        this.getApplication().on({
            discussionOver: this.doDiscussionOver,
            usersSaved: this.doUsersSaved,
            newSpeaker: this.doNewSpeaker,
            yourTurn: this.doMyTurn,
            waitingForNewSpeaker: this.doWaitingForNewSpeaker,
            cordovaLoaded: this.doCordovaLoaded,
            initSession: this.doInitSession,
            scope: this
        });
    },

    launch: function () {
        console.log("flowdebug: launch()");
        var button = this.getAddToQueueButton();
        // temp fix to android context menu on images
        if (EnvUtils.isNative() || !Ext.os.is('Android')) {
            button.setText('');
            button.setStyle('backgroundImage: url(resources/images/icons/myturn-logo.png); ' +
                        'backgroundRepeat: no-repeat; backgroundPosition: center; background-size: contain');
        }
        button.element.on({
            touchstart: 'doAddToQueue',
            touchend: 'doRemoveFromQueue',
            scope: this
        });
        this.initMessageScreen();
        if (!EnvUtils.isNative()) {
            var discussionView = this.getDiscussionView();
            discussionView.add({
                xtype: 'audio',
                hidden: true,
                id: 'beeper',
                url: this.getBeepUrl()
            });
            discussionView.add({
                xtype: 'audio',
                hidden: true,
                id: 'ticker',
                url: this.getTickUrl()
            });
            discussionView.add({
                xtype: 'audio',
                hidden: true,
                id: 'intro',
                url: this.getIntroUrl()
            });
        }
        this.doCordovaLoaded();
    },
    
    doCordovaLoaded: function() {
        if (!EnvUtils.isNative()) {
            return;
        }
        // set media objects for native apps
        var tickUrl = testing.util.UrlUtils.getBaseUrl() + this.getTickUrl();
        var beepUrl = testing.util.UrlUtils.getBaseUrl() + this.getBeepUrl();
        var introUrl = testing.util.UrlUtils.getBaseUrl() + this.getIntroUrl();
        var tickMedia = new Media(
            tickUrl, 
            function() {}, 
            function(err) { 
                //Ext.Msg.alert('tick media error: ' + err.message);
            }
        );
        var beepMedia = new Media(
            beepUrl, 
            function() {}, 
            function(err) { 
                //Ext.Msg.alert('beep media error: ' + err.message);
            }
        );
        var introMedia = new Media(
            mediaUrl,
            function() {},
            function(err) {
                console.log('intro media error' + JSON.stringify(err));
            }
        );
        this.setNativeTickSound(tickMedia);
        this.setNativeBeepSound(beepMedia);
        this.setNativeIntroSound(introMedia);
        // first plays are slow so we do this at launch
        tickMedia.play();
        beepMedia.play();
        //introMedia.play();
        Ext.destroy(this.getTickSound());
        Ext.destroy(this.getBeepSound());
        Ext.destroy(this.getIntroSound());
    }
});
/*
# vim: tabstop=8 expandtab shiftwidth=4 softtabstop=4
*/
