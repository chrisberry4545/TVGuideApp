var React = require('react');
var TvChannel = React.createFactory(require('../TvChannel/TvChannel.jsx'));
var TimeBar = React.createFactory(require('../TimeBar/TimeBar.jsx'));
var store = require('../../stores/store.js');

var TvApp = React.createClass({

    getInitialState: function() {
        return {
            time: this.props.time
        }
    },

    componentDidMount: function() {
        var self = this;
        store.subscribe(function() {
            self.setState({time: store.getState().currentTime});
        });
    },

    generateChannelLines: function() {

    },

    render: function() {
        return (
            <div className={"tvApp"}>
                <TimeBar store={store} />
                {this.props.channelData.channels.map(function(channel) {
                    return <TvChannel channel={channel} store={store} />
                }, this)}
            </div>
        );
    }
})
module.exports = TvApp;
