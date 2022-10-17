import React from 'react'
import { Pane, majorScale } from 'evergreen-ui'
import matter from 'gray-matter'
import path from 'path'
import fs from 'fs'
import orderby from 'lodash.orderby'
import Container from '../../components/container'
import HomeNav from '../../components/homeNav'
import PostPreview from '../../components/postPreview'
import { posts as postsFromCMS } from '../../content'

const Blog = ({ posts }) => {
    return (
        <Pane>
            <header>
                <HomeNav />
            </header>
            <main>
                <Container>
                    {posts.map((post) => (
                        <Pane key={post.title} marginY={majorScale(5)}>
                            <PostPreview post={post} />
                        </Pane>
                    ))}
                </Container>
            </main>
        </Pane>
    )
}

Blog.defaultProps = {
    posts: [],
}

export async function getStaticProps(ctx) {
    const postsDirectory = path.join(process.cwd(), 'posts')
    const filenames = fs.readdirSync(postsDirectory)

    const filePosts = filenames.map((filename) => {
        const filePath = path.join(postsDirectory, filename)
        console.log('path', filePath)
        return fs.readFileSync(filePath, 'utf8')
    })

    // merge our posts from our CMS and fs then sort by pub date
    const posts = orderby(
        [...(ctx.preview ? postsFromCMS.draft : postsFromCMS.published), ...filePosts].map((content) => {
            // extract frontmatter from markdown content
            const { data } = matter(content)
            return data
        }),
        ['publishedOn'],
        ['desc'],
    )

    return { props: { posts } }
}

export default Blog

/**
 * Need to get the posts from the
 * fs and our CMS
 */
