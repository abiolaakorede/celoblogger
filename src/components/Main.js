import { useState } from "react"

export default function Main({ posts, createPost, tipFunction }) {
    const [title, setTitle] = useState("");
    const [image, setImage] = useState("");
    const [author, setAuthor] = useState("");
    const [content, setContent] = useState("");
    const [tip, setTip] = useState(0)

    const formSubmit = (event) => {
        event.preventDefault();
        createPost({ title, image, author, content })
        setAuthor("")
        setTitle("")
        setImage("")
        setContent("")
    }

    const tipSubmit = (event) => {
        event.preventDefault();
    }

    return (
        <main id="main">
            <section id="get-started" className="get-started section-bg">
                <div className="container">
                    <div className="row justify-content-between gy-4">
                        <div className="col-lg-6 d-flex align-items-center" data-aos="fade-up">
                            <div className="content">
                                <h3>Start Blogging</h3>
                                <p>We know you have the talent, begin the journey of freedom on the blockchain
                                </p><p>Follow the insructions to create your first post.</p>
                            </div>
                        </div>
                        <div className="col-lg-5" data-aos="fade">
                            <form onSubmit={formSubmit} className="php-email-form">
                                <h3>Create Post</h3>
                                <div className="row gy-3">
                                    <div className="col-md-12">
                                        <input type="text" className="form-control" onChange={(e) => setTitle(e.target.value)} placeholder="Title" required />
                                    </div>
                                    <div className="col-md-12 ">
                                        <input type="text" className="form-control" onChange={(e) => setImage(e.target.value)} placeholder="Image" required />
                                    </div>
                                    <div className="col-md-12">
                                        <input type="text" className="form-control" onChange={(e) => setAuthor(e.target.value)} name="phone" placeholder="Author" required />
                                    </div>
                                    <div className="col-md-12">
                                        <textarea className="form-control" onChange={(e) => setContent(e.target.value)} rows={6} placeholder="Content" required defaultValue={""} />
                                    </div>
                                    <div className="col-md-12 text-center">
                                        <button type="submit">Create</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
            <section id="constructions" className="constructions">
                <div className="container" data-aos="fade-up">
                    <div className="section-header">
                        <h2>Posts</h2>
                        <p>The Post </p>
                    </div>
                    <div className="row gy-4">
                        {posts.map((post) => <div className="col-lg-6" data-aos="fade-up" data-aos-delay={100 * (post.index + 1)}>
                            <div className="card-item">
                                <div className="row">
                                    <div className="col-xl-5">
                                        <div className="card-bg" style={{ backgroundImage: `url(${post.image})` }} />
                                    </div>
                                    <div className="col-xl-7 d-flex align-items-center">
                                        <div className="card-body">
                                            <h4 className="card-title">{post.title}</h4>
                                            <i>Author: {post.author}</i>
                                            <div><small> Number of Tippers: {post.tippers}</small></div>
                                            <br />
                                            <p>{post.content}</p>
                                            <form onSubmit={tipSubmit} className="php-email-form">
                                                <div className="row gy-3">
                                                    <div className="col-md-12">
                                                        <input type="number" className="form-control" onChange={(e) => setTip(e.target.value)} placeholder="Tip Amount (>0)" required />
                                                    </div>
                                                    <div className="col-md-12 text-center">
                                                        <button onClick={() => tip > 0 && tipFunction({ tip, index: post.index })} type="submit">TIP</button>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                        <div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>)}{/* End Card Item */}
                    </div>
                </div>
            </section>

        </main>


    )
}

