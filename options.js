// Saves options to localStorage.
function save_options() {
  localStorage["tweet_nocount"] = document.getElementById("no_count").checked ? 1 : 0;
  localStorage["tweet_novia"] = document.getElementById("no_via").checked ? 1 : 0;

  // Update status to let user know options were saved.
  var status = document.getElementById("status");
  status.innerHTML = "Options Saved.";
  setTimeout(function() {
      status.innerHTML = "";
  }, 1000);
}

// Restores select box state to saved value from localStorage.
function restore_options() {
  document.getElementById("no_count").checked = localStorage["tweet_nocount"] == 1;
  document.getElementById("no_via").checked = localStorage["tweet_novia"] == 1;
}

window.onload = function() {
  restore_options();
  document.getElementById("save").onclick = save_options;
}
