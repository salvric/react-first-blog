

class CommentBox extends React.Component {
    constructor(props){
        super(props);
        this.state = {data:[]};
        this.handleCommentSubmit = this.handleCommentSubmit.bind(this);
    }

     handleCommentSubmit(comment) {
        var comments = this.state.data;
        var newComments = comments.concat([comment]);
        this.setState({data: newComments});
         $.ajax({
            url: this.props.url,
            dataType: 'json',
            type: 'POST',
            data: comment,
            success : (data) => {
            this.setState({data: data});
            },
            error : (xhr, status, err) => {
            this.setState({data: comments});
            console.error(this.props.url, status, err.toString());
            }
        });
    }
    
    componentDidMount() {
        var loadCommentsFromServer = () => {
            $.ajax({
                url: this.props.url,
                dataType: 'json',
                cache: false,
                success: (data) => {
                this.setState({data: data});
                },
                error: (xhr, status, err) => {
                console.error(this.props.url, status, err.toString());
                }
            });
        }
        loadCommentsFromServer();
        setInterval(loadCommentsFromServer, this.props.pollInterval);
    }
    render() {
        return ( 
            <div className = "commentBox" >
            <h1>Comment Box.</h1>
            <CommentList data={this.state.data} />
            <CommentForm onCommentSubmit={this.handleCommentSubmit}/>
            </div>
        );
    }
};

class CommentList extends React.Component {
    render() {
        var commentNodes = this.props.data.map( (comment)=> {
            return(
                <Comment author={comment.author} key={comment.id}>
                    {comment.text}
                </Comment>
            );            
        });
        return(
            <div className="commentList">
                {commentNodes}
            </div>
        );
    }
};

class CommentForm extends React.Component {

    constructor(props){
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
      e.preventDefault();
      var author = ReactDOM.findDOMNode(this.refs.author).value.trim();
      var text = ReactDOM.findDOMNode(this.refs.text).value.trim();
      if (!text || !author) {
            return; 
        }
      this.props.onCommentSubmit({author, text});
      ReactDOM.findDOMNode(this.refs.author).value = '';
      ReactDOM.findDOMNode(this.refs.text).value = '';
      return;
    }
   
    render() {
        return (
            <form className = "commentForm" onSubmit={this.handleSubmit}>
                <input type="text" placeholder="scrivi qualcosa..." ref="author"/>
                <input type="text" placeholder="ciao gore..." ref="text"/>
                <input type="submit" value="Invia"/>
            </form>
        );
    }
};

class Comment extends React.Component {
    render() {
        return (
            <div className="comment">
                <h2>{this.props.author}</h2>
                {this.props.children}
            </div>
        )
    }
};

ReactDOM.render( 
    <CommentBox url="api/comments" pollInterval={2000} /> ,
    document.getElementById('content')
);