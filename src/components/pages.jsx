var Pages = (props) => (
  <div>
    <h1>Pages</h1>
    <ul className="list-group">
      {props.pages.map(page =>
        <li className="list-group-element" onClick={props.handleClick} id={page._id} >{page.title}</li>
      )}
    </ul>
  </div>
);

window.Pages = Pages;
