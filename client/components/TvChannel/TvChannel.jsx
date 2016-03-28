var React = require('react');
var TvProgramme = React.createFactory(require('../TvProgramme/TvProgramme.jsx'));
var TvChannel = React.createClass({

    getInitialState: function() {
        return {
        }
    },

    render: function() {
        return (
            <div className={"tvChannel"}>

                <div className={"tvChannel__title"}>
                    <h2 className={"tvChannel__title__text"}>{this.props.channel.name}</h2>
                </div>

                {this.props.channel.data.channel.programme.map(function(programme, i) {
                    return <TvProgramme programme={programme} store={this.props.store} />
                }, this)}
            </div>
        );
    }
})
module.exports = TvChannel;
