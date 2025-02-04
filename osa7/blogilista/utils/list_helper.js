const dummy = (blogs) => {
    // ...

    return 1
  }

const totalLikesReducer = (likes, blog) => {
    return likes + blog.likes
  }

const mostLikesReducer = (blogWithMostLikes, blog) => {
    console.log(blogWithMostLikes, blog)
    return blog.likes > blogWithMostLikes.likes ? blog : blogWithMostLikes;
}

const totalLikes = (blogs) =>{
    return blogs.length === 0 ? 0 : blogs.reduce(totalLikesReducer,0);
}

const favoriteBlog = (blogs) => {
    return blogs.length === 0 ? 0 : blogs.reduce(mostLikesReducer);
}

const mostBlogs = (blogs) => {
    if(blogs.length === 0){
        return 0
    }

    let author_dict = {}
    for(let blog of blogs){
        if (Object.keys(author_dict).includes(blog.author))
            author_dict[blog.author]+=1
        else
            author_dict[blog.author] = 1
    }

    const mostBlogs = Array.from(Object.entries(author_dict)).reduce((mostBlogs, author) => {
        return mostBlogs > author ? mostBlogs : author;
    }, 0);
    
    return {author:mostBlogs[0],blogs:mostBlogs[1]}
}

const mostLikes = (blogs) => {

    if(blogs.length === 0){
        return 0
    }

    let author_dict = {}
    //const entries = Object.entries(blogs)
    //console.log(entries)

    for(let i = 0; i<blogs.length; i++){
        if((Object.keys(author_dict).includes(blogs[i].author)))
            author_dict[blogs[i].author]+=blogs[i].likes
        else
            author_dict[blogs[i].author] = blogs[i].likes
    }

    const likes_total = totalLikes(blogs)
    console.log(likes_total)
    console.log(author_dict)
    const final_array = Array.from(Object.entries(author_dict)).reduce((highest_ratio,authorTotalLikes)=>{console.log(highest_ratio,authorTotalLikes);return highest_ratio[1]>authorTotalLikes[1]/likes_total ? highest_ratio : [authorTotalLikes[0],authorTotalLikes[1]/likes_total] },[0,0])
    console.log("Finaly array: ",final_array)
    return final_array
}


/* const mostBlogs = (blogs) =>{
    return blogs.length === 0 ? 0 : blogs.
} */

  module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
  }