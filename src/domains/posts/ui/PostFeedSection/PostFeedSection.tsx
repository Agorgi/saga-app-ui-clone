import { PostFeed } from '../PostFeed/PostFeed';

// Temporary section component before I make a "Feed" feature.
// The posts feature, like commments, will probably not have a sections folder.

export function PostFeedSection() {
  return <PostFeed feedType="feed" renderContainer={false} viewContext="feed" />;
}
