import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

/** API Class.
 *
 * Static class tying together methods used to get/send to to the API.
 * There shouldn't be any frontend-specific stuff here, and there shouldn't
 * be any API-aware stuff elsewhere in the frontend.
 *
 */

class JoblyApi {
  // the token for interactive with the API will be stored here.
  static token;

  static async request(endpoint, data = {}, method = "get") {
    console.debug("API Call:", endpoint, data, method);

    //there are multiple ways to pass an authorization token, this is how you pass it in the header.
    //this has been provided to show you another way to pass the token. you are only expected to read this code for this project.
    const url = `${BASE_URL}/${endpoint}`;
    const headers = { Authorization: `Bearer ${JoblyApi.token}` };
    const params = (method === "get")
        ? data
        : {};

    try {
      return (await axios({ url, method, data, params, headers })).data;
    } catch (err) {
      console.error("API Error:", err.response);
      let message = err.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  // Individual API routes

  /** Get details on a company by handle. */

  static async getCompany(handle) {
    let res = await this.request(`companies/${handle}`);
    return res.company;
  }

  /** Get auth token or get denied */
  static async login(username, password) {
    let res = await this.request(`auth/token`, {
      username: username,
      password: password
    }, 'post');
    
    return res.token;
  }

  /** get list of all companies (filtered by name if not undefined) */
  static async getAllCompanies(name) {
    let res = await this.request(`companies`, {name});
    return res.companies;
  }

  /** get list of all Jobs (filtered by name if not undefined) */
  static async getAllJobs(title) {
    let res = await this.request(`jobs`, {title});
    return res.jobs;
  }

  /** Signup and return token */
  static async signUp(userObj) {
    let res = await this.request(`auth/register`, userObj, 'post');
    return res.token;
  }


  /** Get the current user. */
  static async getCurrentUser(username) {
    let res = await this.request(`users/${username}`);
    return res.user;
  }

  /** Alert current loggedin user's info.
   * User can only change { firstName, lastName, password, email } = infoObj
   */
  static async editUserInfo(username, infoObj) {
    let res = await this.request(`users/${username}`, infoObj, 'patch');
    return res.user;
  }

  /** Applies for jobs
   * I: (username, id), id can be a string prob
   * O: returns jobId
   */
  static async jobApply(username, id){
    console.debug(`${username}/jobs/${id}`);
    let res = await this.request(`users/${username}/jobs/${id}`, {}, 'post');
    return res.applied;
  }
}

// for now, put token ("testuser" / "password" on class)
// JoblyApi.token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZ" +
//     "SI6InRlc3R1c2VyIiwiaXNBZG1pbiI6ZmFsc2UsImlhdCI6MTU5ODE1OTI1OX0." +
//     "FtrMwBQwe6Ue-glIFgz_Nf8XxRT2YecFCiSpYL0fCXc";

export default JoblyApi;