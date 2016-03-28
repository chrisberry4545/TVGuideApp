var React = require('react');

var TimeBar = React.createClass({

    getInitialState: function() {
        return {
        }
    },

    goBack: function() {
        console.log('Go back..');
        this.props.store.dispatch({ type: 'BACKWARD' })
    },

    goForward: function() {
        this.props.store.dispatch({ type: 'FORWARD' });
        console.log('Go forward');
    },

    render: function() {

        var timeBarTimeSections = [];
        var currentHours = new Date(this.props.store.getState().currentTime).getHours();
        for (var i = 0; i < 24; i++) {
            timeBarTimeSections.push(<div style={i >= currentHours ? {}: {display: 'none'} } className={"timeBar__timeSection"}>{(i) + ':00'}</div>);
        }

        return (
            <div className={"timeBar"}>
                <button className={"timeBar__btn timeBar__btn--backward"} onClick={this.goBack}> Back </button>
                <div>
                    {timeBarTimeSections}
                </div>
                <button className={"timeBar__btn timeBar__btn--forward"} onClick={this.goForward}> Next </button>
            </div>
        );
    }
})
module.exports = TimeBar;
