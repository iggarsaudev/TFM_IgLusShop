import "./notFound.css";

export default function NotFound() {
  return (
    <div className="not-found">
      <div className="not-found__content">
        <h1 className="not-found__title">404</h1>
        <p className="not-found__message">
          The page you are looking for does not exist.
        </p>
        <a href="/" className="not-found__link">
          Return to home
        </a>
      </div>
    </div>
  );
}
