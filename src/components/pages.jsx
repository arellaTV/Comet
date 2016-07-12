var Pages = (props) => (
  <div>
    <h1>Pages</h1>
    <ul>
      {props.pages.map(page =>
        <li onClick={props.handleClick} id={page._id}>{page.title}</li>
      )}
    </ul>
  </div>
);

window.Pages = Pages;
