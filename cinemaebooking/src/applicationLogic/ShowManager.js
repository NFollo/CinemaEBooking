import {axiosGetShowById} from "./AxiosShowManager";

export async function getShowById(id) {
    return axiosGetShowById(id);
} // getShowById