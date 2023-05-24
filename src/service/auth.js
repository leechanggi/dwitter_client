export default class AuthService {
  constructor(httpClient) {
    this.http = httpClient;
  }

  async signup(username, password, name, email, url) {
    return this.http.fetch("/auth/signup", {
      method: "POST",
      body: JSON.stringify({
        username,
        password,
        name,
        email,
        url,
      }),
    });
  }

  async login(username, password) {
    return this.http.fetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
  }

  async logout() {
    return this.http.fetch("/auth/logout", {
      method: "POST",
    });
  }

  async me() {
    return this.http.fetch("/auth/me", {
      method: "GET",
    });
  }

  async csrfToken() {
    const req = this.http.fetch("/auth/csrf-token", {
      method: "GET",
    });
    console.log(req);
    return toString(req.csrfToken);
  }
}
