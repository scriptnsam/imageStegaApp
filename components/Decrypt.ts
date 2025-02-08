import useRequest from "@/hooks/useRequest";

const { request, error, data } = useRequest();

const handleDecryptImage = async (imageBase64: string) => {
    const payload = {
        image: imageBase64,
    };

    try {
        await request(`${process.env.EXPO_PUBLIC_BACKEND_URL}/decode`, "POST", payload);

        if (error) {
            console.log(error);
            // Extract error message from axios error response
            // const errorMessage = error.response?.data?.message || error.message || "Something went wrong";
            const errorMessage = error.response.data.error;
            return { error: true, errorMessage };
        }

        if (data) {
            return { error: false, data };
        }

    } catch (error) {
        console.error("Error during decryption:", error);
        return { error: true, errorMessage: error };
    }
}


export default handleDecryptImage;