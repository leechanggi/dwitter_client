import axios from "axios";
import axiosRetry from "axios-retry";

const defaultRetryConfig = {
  retries: 5,
  retryDelaySec: 250,
};

export default class HttpClient {
  constructor(baseURL, authErrorEventBus, getCsrfToken, config = defaultRetryConfig) {
    this.authErrorEventBus = authErrorEventBus;
    this.getCsrfToken = getCsrfToken;
    this.client = axios.create({
      baseURL,
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    axiosRetry(this.client, {
      retries: config.retries,
      retryDelay: (retryCount) => {
        const delaySec = Math.pow(2, retryCount) * config.retryDelaySec;
        function delayJitter(sec) {
          const numSec = Number(sec);
          if (numSec <= 1000) {
            return numSec + numSec * 0.1 * Math.random();
          } else {
            return numSec + 100 * Math.random();
          }
        }
        return delayJitter(delaySec);
      },
      retryCondition: (error) =>
        axiosRetry.isNetworkOrIdempotentRequestError(error) || error.response.status === 429,
    });
  }

  async fetch(url, options) {
    const { method, headers, body } = options;
    const req = {
      url,
      method,
      headers: {
        ...headers,
        "_csrf-token": this.getCsrfToken(),
      },
      data: body,
    };

    try {
      const res = await this.client(req);
      return res.data;
    } catch (error) {
      if (error.response) {
        const data = error.response.data;
        const message =
          data && data.message ? data.message : "일시적 네트워크 장애가 발생하였습니다.";
        throw new Error(message);
      }
      throw new Error("일시적 서비스 장애가 발생하였습니다.");
    }
  }
}
