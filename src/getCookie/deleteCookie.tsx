function deleteCookie(cname: string) {
    // Set the expiration date to a past time
    const d = new Date();
    d.setTime(d.getTime() - (3 * 24 * 60 * 60 * 1000));
    let expires = "expires="+d.toUTCString();
    // Set the cookie with an expired date to delete it
    document.cookie = cname + "=;" + expires + ";path=/";
  }


export default deleteCookie
  