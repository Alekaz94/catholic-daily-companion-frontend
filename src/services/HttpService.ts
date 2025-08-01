import API from './api';

class HttpService {
  endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  getAll<T>() {
    return API.get<T[]>(this.endpoint);
  }

  get<T>(id: string) {
    return API.get<T>(`${this.endpoint}/${id}`);
  }

  post<T>(data: T) {
    return API.post(this.endpoint, data);
  }

  put<T>(id: string, data: T) {
    return API.put(`${this.endpoint}/${id}`);
  }

  delete<T>(id: string) {
    return API.delete(`${this.endpoint}/${id}`);
  }
}

const createService = (endpoint: string) => new HttpService(endpoint);
export default createService;
