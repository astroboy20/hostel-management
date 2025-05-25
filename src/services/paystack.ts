import axios from "axios"
import { config } from "../config"


interface InitializePaymentParams {
    email: string
    amount: number
    reference: string
}

interface InitializePaymentResponse {
    data: {
        authorization_url: string
        reference: string
    }
}

interface VerifyPaymentResponse {
    data: {
        status: "success" | "failed" | "pending"
        reference: string
        amount: number
    }
}

export const initiatePayment = async (params: InitializePaymentParams): Promise<InitializePaymentResponse> => {
    const request = await axios.post("https://api.paystack.co/transaction/initialize", {
        email: params.email,
        amount: params.amount * 100,
        reference: params.reference
    }, {
        headers: {
            Authorization: `Bearer ${config.PAYSTACK_SECRET_KEY}`,
            "Content-Type": "application/json"
        }
    })

    return request.data as InitializePaymentResponse
}


export const VerifyPayment = async (refernce: string): Promise<VerifyPaymentResponse> => {
    const response = await axios.get("", {
        headers: {
            Authorization: `Bearer ${config.PAYSTACK_SECRET_KEY}`,
            "Content-Type": "application/json"
        }
    })
    return response.data as VerifyPaymentResponse
}