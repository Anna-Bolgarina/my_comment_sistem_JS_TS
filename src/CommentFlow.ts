class CommentFlow extends CommentSystem {
  private commentNamb: number;
  private replyes: AnswerComment;
  private rating: Rating;
  private filter: DropdownList;
  public favorites: Favorite;

  constructor(userNewComment: NewComment) {
    super();
    this.commentNamb = super.getNumberComments();
    this.rating = new Rating();
    this.favorites = new Favorite();
    this.replyes = new AnswerComment(
      userNewComment,
      this.rating,
      this.favorites
    );
    this.filter = new DropdownList(this);
    this.updateComments();

    const listenerSendComment = (event: Event): void => {
      if (
        userNewComment.sendButton &&
        !userNewComment.sendButton.classList.contains("button-notActiv") &&
        userNewComment.sendButton.dataset.mode === "comment"
      ) {
        const commentText = userNewComment.getNewComment();
        this.createCommentBlock(commentText);
        userNewComment.clearNewComment();
      } else if (
        userNewComment.sendButton &&
        !userNewComment.sendButton.classList.contains("button-notActiv") &&
        userNewComment.sendButton.dataset.mode === "reply"
      ) {
        const replyText = userNewComment.getNewComment();
        this.replyes.createReplyes(replyText);
        userNewComment.clearNewComment();
        userNewComment.sendButton.dataset.mode = "comment";
        this.userNewComment.changeButton("Отправить");
        this.userNewComment.changeCommentNewText("Введите текст сообщения...");
      }
    };

    if (userNewComment.sendButton)
      userNewComment.sendButton.addEventListener(
        "click",
        listenerSendComment,
        false
      );
  }

  protected createCommentBlock(commentsText: string) {
    const userName = super.getUserName();
    const userAvatar = super.getUserAvatar();
    const currentDate = super.getCurrentDate();
    const commetsText = commentsText;
    const newCommentBlock = {
      commentNamb: this.commentNamb,
      comment: {
        commentName: userName,
        commentAvatar: userAvatar,
        commentTime: currentDate,
        commentText: commetsText,
      },
      replyes: {},
      rating: 0,
    };
    super.addHistoryComments(newCommentBlock);

    const commentHTMLTemplate = this.getFlowComment(
      this.commentNamb,
      userName,
      userAvatar,
      commetsText,
      currentDate.displayDate
    );
    this.renderComment(commentHTMLTemplate);
    this.replyes.addListenerReplyButton(this.commentNamb);
    this.rating.addListenerCommentsRatingButtons(this.commentNamb);
    this.favorites.addListenerCommentsFavoritesButtons(this.commentNamb);
    this.filter.currentFilter();
    this.commentNamb++;
    super.updateNumberComments();
  }

  private renderComment(html: string) {
    const comments: HTMLElement | null =
      document.querySelector(".comment__flow");
    if (comments) {
      comments.insertAdjacentHTML("afterbegin", html);
    }
  }

  public hiddenComments(bool: boolean) {
    const comments: NodeListOf<Element> = document.querySelectorAll(
      ".comment-flow__block"
    );
    comments.forEach((item: any) => {
      if (bool) {
        item.style.display = "none";
      } else {
        item.style.display = "block";
      }
    });
  }

  public updateComments() {
    const comments: HTMLElement | null = document.querySelector(
      ".comment-flow__block"
    );
    if (comments) {
      const commentBlocks: NodeListOf<Element> | null =
        comments.querySelectorAll(".comment-flow__block");
      commentBlocks.forEach((item) => comments.removeChild(item));
    }
    const currentData = super.getDATA();
    let htmlTemplateComment: string;
    currentData.history.forEach((item: any) => {
      htmlTemplateComment = this.getFlowComment(
        item.commentNamb,
        item.comment.commentName,
        item.comment.commentAvatar,
        item.comment.commentText,
        item.comment.commentTime.displayDate
      );
      this.renderComment(htmlTemplateComment);
      this.replyes.updateReply(item);
      this.replyes.addListenerReplyButton(item.commentNamb);
      this.rating.addListenerCommentsRatingButtons(item.commentNamb);
      this.favorites.addListenerCommentsFavoritesButtons(item.commentNamb);
    });
    super.updateNumberComments();
  }

  private getFlowComment(
    commentNamb: number,
    userName: string | undefined,
    userAvatar: string | undefined | null,
    commentText: string,
    date: string
  ) {
    return `
   <div class="comment-flow__block" data-commentnamb=${commentNamb}>
          <div class="comment-flow__comment">
              <img class="user-flow__avatar" src="${userAvatar}" alt="аватарка">
            <div class="comment-flow__contant">
              <div class="comment-flow__user">
                  <span class="user-flow__name">${userName}</span>
                  <time class="comment-flow__time">${date}</time>
              </div>
              <p class="comment-flow__text">
                ${commentText}
              </p>
              <div class="comment-flow__buttons">
                <button class="comment-flow__buttonAnswer"><img src="img/Answer.svg" alt="ответить">Ответить</button>
                <button class="comment-flow__buttonFavorite" data-favorite="false"><img src="img/Heart1.svg" alt="в избранное"/><span>В избранное</span></button>
                <div class="comments__rating">
                  <button class="minus"><img src="img/minus.svg" alt="минус"></button>
                  <span class="likeCounter">0</span>
                  <button class="plus"><img src="img/Plus.svg" alt="плюс"></button>
                </div>
              </div>
            </div>
          </div>
        </div>
    `;
  }
}
