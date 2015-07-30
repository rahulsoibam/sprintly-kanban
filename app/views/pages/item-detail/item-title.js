import React from 'react/addons';
import _ from 'lodash';
import helpers from '../../components/helpers';
import ItemDetailMixin from './detail-mixin';
import {State} from 'react-router'
import ProductActions from '../../../actions/product-actions';
import classNames from "classnames";

const TITLE_ATTRS = {
  who: {
    title: "As an",
    placeholder: "e.g. an accountant"
  },
  what: {
    title: "I want",
    placeholder: "e.g. Quickbooks integration"
  },
  why: {
    title: "so that",
    placeholder: "e.g. I don't have to import CSV's daily"
  }
};
const STORY_ATTRS = ['who', 'what', 'why'];

var ItemTitle = React.createClass({

  mixins: [State, ItemDetailMixin],

  propTypes: {
    itemId: React.PropTypes.number,
    type: React.PropTypes.string,
    title: React.PropTypes.string,
    who: React.PropTypes.string,
    what: React.PropTypes.string,
    why: React.PropTypes.string,
    setItem: React.PropTypes.func
  },

  getInitialState() {
    return {
      titleEditable: false
    }
  },

  presentationTitle() {
    if (this.props.type === 'story') {
      var whoFirstWord = this.props.who.split(' ')[0];
      var whoPre = helpers.vowelSound(whoFirstWord) ? 'As an ' : 'As a ' ;

      return  [
        <span className="italicize">{whoPre}</span>,
        `${this.props.who}`,
        <span className="italicize"> I want </span>,
        `${this.props.what}`,
        <span className="italicize"> so that </span>,
        `${this.props.why}`
      ]
    } else {
      return this.props.title
    }
  },

  storyTitleInput() {
    return _.map(STORY_ATTRS, (attr, i) => {
      var classes = classNames({
        "form-control": true,
        "title-input": true,
      });

      return (
        <div className={`item-title__field ${attr}`} key={i}>
          <span>{TITLE_ATTRS[attr].title}</span>
          <div className={`input-group ${attr}`}>
            <label>{helpers.toTitleCase(attr)}</label>
            <input className={classes}
                        type="text"
                        name={attr}
                         ref={attr + 'Input'}
                 placeholder={TITLE_ATTRS[attr].placeholder}
                       value={this.props[attr]}
                    onChange={_.partial(this.props.setItem, attr)} />
          </div>
        </div>
      )
    })
  },

  defaultTitleInput() {
    return (
      <div className="item-title__field default">
        <div className="input-group">
          <input className="form-control title-input"
            placeholder="What is it?"
            name="title"
            ref="titleInput"
            value={this.props.title}
            onChange={_.partial(this.props.setItem, 'title')} />
        </div>
      </div>
    )
  },

  editTitle() {
    if (this.props.type === 'story') {
      return this.storyTitleInput();
    } else {
      return this.defaultTitleInput();
    }
  },

  toggleTitleEdit() {
    if (this.state.titleEditable) {
      const TITLE_ATTR = 'title';

      if (this.props.type === 'story') {
        let productId = this.getParams().id;
        let itemId = this.getParams().number;
        let newAttrs = {
          who: this.props.who,
          what: this.props.what,
          why: this.props.why
        }

        ProductActions.updateItem(productId, itemId, newAttrs);
      } else {
        this.updateAttribute(this.props.itemId, TITLE_ATTR, this.props.title)
      }
    }

    this.setState({titleEditable: !this.state.titleEditable});
  },

  toggleButton() {
    let buttonCopy = this.state.titleEditable ? 'Save' : 'Edit';

    return (
      <div className="title__edit">
        <button className="detail-button kanban-button-secondary" onClick={this.toggleTitleEdit}>
          {buttonCopy}
        </button>
      </div>
    )
  },

  render() {
    let titleClass = `title ${this.props.type}`
    let title = this.state.titleEditable ? this.editTitle() : this.presentationTitle();
    let toggleButton = this.toggleButton();

    return (
      <div className={titleClass}>
        {title}
        {toggleButton}
      </div>
    )
  }
})

export default ItemTitle;
