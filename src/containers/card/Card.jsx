import React, { Component } from "react";
import PropTypes from "prop-types";
import { Redirect } from "react-router-dom";
import styled from "styled-components/";

import { v4 as UKG } from "uuid";

import { notEmptyArray } from "../../utility/Validator";
import styles from "./Card.module.css";
import {
  MenuItems,
  getBySectionId,
} from "../navigationArea/MenuItemsConstants";

export default class Card extends Component {
  constructor(props) {
    super(props);
    this.state = {
      articleId: "",
      enableRedirect: false,
    };
  }

  loadArticle = (articleId) => {
    this.setState({ articleId }, () => {
      this.setState({ enableRedirect: true });
    });
  };

  getBorderBottomColor = (sectionId) => {
    const menuItem = getBySectionId(sectionId);
    return styled.div`
      border-bottom: 3px solid
        ${() => (menuItem ? menuItem.color : MenuItems.HOME.color)};
    `;
  };

  render() {
    const { card, tabIndex, styleConfig } = this.props;
    const { enableRedirect, articleId } = this.state;

    const ColorBorderDiv = this.getBorderBottomColor(card.sectionId);

    return (
      <>
        <div
          className={
            notEmptyArray(styleConfig.mainClass)
              ? styleConfig.mainClass
              : ["col-l-3", "col-m-4", "col-s-6", "col-mob-12"].join(" ")
          }
          key={UKG()}
        >
          <ColorBorderDiv>
            <div
              role="button"
              tabIndex={tabIndex}
              className={
                styleConfig.autoHeight
                  ? [styles.container, styles.autoHeightContainer].join(" ")
                  : styles.container
              }
              onClick={() => this.loadArticle(card.id)}
              onKeyDown={() => this.loadArticle(card.id)}
            >
              {!styleConfig.onlyContent && (
                <img
                  src={
                    card.fields && card.fields.thumbnail
                      ? card.fields.thumbnail
                      : process.env.PUBLIC_URL.concat("/thePeaks.jpg")
                  }
                  alt={card.webTitle}
                />
              )}
              <div
                className={
                  styleConfig.onlyContent
                    ? [styles.content, styles.relative].join(" ")
                    : [styles.content, styles.absolute].join(" ")
                }
              >
                <p>{card.webTitle}</p>
              </div>
            </div>
          </ColorBorderDiv>
        </div>

        {enableRedirect && (
          <Redirect
            to={{
              pathname: "/viewArticle",
              state: {
                articleId,
              },
            }}
            push
          />
        )}
      </>
    );
  }
}

Card.defaultProps = {
  tabIndex: 0,
  styleConfig: {},
};

Card.propTypes = {
  card: PropTypes.shape({
    id: PropTypes.string.isRequired,
    fields: PropTypes.shape({ thumbnail: PropTypes.string }),
    webTitle: PropTypes.string.isRequired,
    sectionId: PropTypes.string.isRequired,
  }).isRequired,
  tabIndex: PropTypes.number,
  styleConfig: PropTypes.shape({
    autoHeight: PropTypes.bool,
    fullWidth: PropTypes.bool,
    onlyContent: PropTypes.bool,
    mainClass: PropTypes.arrayOf(PropTypes.string),
  }),
};
