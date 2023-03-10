export default (state = localStorage.getItem("theme"), action) => {
  switch (action.type) {
    case "INITIALIZE_THEME":
      localStorage.setItem("theme", "dark");
      return "dark";
    case "TOGGLE_THEME":
      localStorage.setItem(
        "theme",
        localStorage.getItem("theme") === "dark" ? "light" : "dark"
      );
      console.log(localStorage.getItem("theme"));
      return localStorage.getItem("theme");
    default:
      return state;
  }
};
