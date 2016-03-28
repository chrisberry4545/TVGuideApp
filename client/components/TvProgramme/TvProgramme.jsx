var React = require('react');
var TvProgramme = React.createClass({

    getInitialState: function() {
        return {
            time: this.props.store.getState().currentTime
        }
    },

    render: function() {
        if (new Date(this.state.time).getTime() < new Date(this.props.programme.timings.end).getTime()) {

            return (
                <div className={"tvProgramme"} style={ {width: (this.props.programme.duration * 5) + 'px'} }>
                    <div>{this.props.programme.title} - {this.props.programme.start} - {this.props.programme.end}</div>
                </div>
            );

        }
        return (<div></div>)
    }
})
module.exports = TvProgramme;
