const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// 在构建时执行
function buildBlogPosts() {
  const postsDir = path.join(__dirname, '../src/posts');
  const outputFile = path.join(__dirname, '../src/data/generatedPosts.json');
  
  const posts = fs.readdirSync(postsDir)
    .filter(file => file.endsWith('.md'))
    .map(file => {
      const content = fs.readFileSync(path.join(postsDir, file), 'utf8');
      const { data, content: postContent } = matter(content);
      return {
        ...data,
        content: postContent,
        slug: file.replace('.md', ''),
        readingTime: Math.ceil(postContent.split(/\s+/).length / 200)
      };
    });
    
  fs.writeFileSync(outputFile, JSON.stringify(posts, null, 2));
}

buildBlogPosts(); 