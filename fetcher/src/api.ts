import fetch, { RequestInfo, RequestInit, Response } from 'node-fetch';

export class ApiError extends Error {
  public response: Response;

  public constructor(response: Response) {
    super(response.statusText);
    this.response = response;
  }
}

/**
 * Smol data-access layer for making requests to Apis
 */
class Api {
  private async request(path: RequestInfo, options: RequestInit = {}) {
    let response = await fetch(path, options);

    if (response.status === 200) {
      // Success
      let contentTypeHeader = response.headers.get('Content-Type');

      if (contentTypeHeader && contentTypeHeader.includes('application/json')) {
        return response.json();
      } else {
        return response.text();
      }
    } else {
      // Failure
      throw new ApiError(response);
    }
  }

  public async get(path: RequestInfo, options: RequestInit = {}) {
    return this.request(path, Object.assign({}, options, {
      method: 'GET',
    } as RequestInit))
  }
}

export default new Api();
