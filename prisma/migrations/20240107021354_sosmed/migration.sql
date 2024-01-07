-- DropIndex
DROP INDEX `User_username_key` ON `user`;

-- CreateIndex
CREATE FULLTEXT INDEX `Post_caption_tags_idx` ON `Post`(`caption`, `tags`);
