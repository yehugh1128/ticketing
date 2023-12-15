import axios from "axios";

export default ({ req }) => {
    if (typeof window === 'undefined') {
        // 在服务端发送请求
        return axios.create({
            baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
            headers: req.headers
        });
    }
    else {
        // 在浏览器中发送请求
        return axios.create({
            baseURL: '/'
        });
    }
}