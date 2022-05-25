import PropTypes from "prop-types";

function PageBase({ children }) {
  return (
    <div>
      <main>
        {children}
      </main>
    </div>
  );
}

PageBase.propTypes = {
  children: PropTypes.element,
};

export default PageBase;
