import {axiosCreatePaymentCard} from "./AxiosCardManager";

export function createPaymentCard(cardDetails, addressDetails) {
    return axiosCreatePaymentCard(cardDetails, addressDetails);
} 