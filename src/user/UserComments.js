import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Feed from '../feed/Feed';
import { getFeed, getPosts } from '../reducers';
import {
  getUserCommentsFromState,
  getFeedLoadingFromState,
  getFeedHasMoreFromState,
} from '../helpers/stateHelpers';
import { getUserComments, getMoreUserComments } from './userActions';

@connect(
  state => ({
    feed: getFeed(state),
    posts: getPosts(state),
  }),
  {
    getUserComments,
    getMoreUserComments,
  },
)
export default class UserProfilePosts extends React.Component {
  static propTypes = {
    feed: PropTypes.shape().isRequired,
    posts: PropTypes.shape().isRequired,
    match: PropTypes.shape().isRequired,
    limit: PropTypes.number,
    getUserComments: PropTypes.func,
    getMoreUserComments: PropTypes.func,
  };

  static defaultProps = {
    limit: 10,
    getUserComments: () => {},
    getMoreUserComments: () => {},
  };

  static needs = [({ name }) => this.props.getUserComments({ username: name })];

  componentWillMount() {
    this.props.getUserComments({
      username: this.props.match.params.name,
    });
  }

  render() {
    const { feed, posts, match, limit } = this.props;
    const username = match.params.name;

    const content = getUserCommentsFromState(username, feed, posts);
    const isFetching = getFeedLoadingFromState('comments', username, feed);
    const hasMore = getFeedHasMoreFromState('comments', username, feed);
    const loadMoreContentAction = () => this.props.getMoreUserComments(username, limit);

    return (
      <Feed
        content={content}
        isFetching={isFetching}
        hasMore={hasMore}
        loadMoreContent={loadMoreContentAction}
      />
    );
  }
}
