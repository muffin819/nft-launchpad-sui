import axiosInstance from "@/util/axios"

export const checkWL = async (address: string) => {
  try {
    const response = await axiosInstance.post(`${process.env.NEXT_PUBLIC_API_URL}api/wl/check`, {
      address: address
    })
    if (response.status === 403) {
      return {
        success: false,
        error: 403
      }
    }
    else {
      return response.data
    }
  }
  catch (error) {
    return {
      success: false,
      error: error
    }
  }
}

export const checkMintStatus = async () => {
  try {
    const response = await axiosInstance.post(`${process.env.NEXT_PUBLIC_API_URL}api/art/status`)

    if (response.status === 403) {
      return {
        success: false,
        error: 403
      }
    }
    else {
      return response.data
    }
  }
  catch (error) {
    return {
      success: false,
      error: error
    }
  }
}


export const getArts = async (address: string, count: number) => {
  try {
    const response = await axiosInstance.post(`${process.env.NEXT_PUBLIC_API_URL}api/art/getarts`, { address, count })

    if (response.status === 403) {
      return {
        success: false,
        error: 403
      }
    }
    else {
      return response.data
    }
  }
  catch (error:any) {
    console.log("error!!!!")
    return {
      success: false,
      error: error.response.data
    }
  }
}

export const restoreArts = async (arts: any) => {
  try {
    const response = await axiosInstance.post(`${process.env.NEXT_PUBLIC_API_URL}api/art/restore`, { arts })

    if (response.status === 403) {
      return {
        success: false,
        error: 403
      }
    }
    else {
      return response.data
    }
  }
  catch (error) {
    return {
      success: false,
      error: error
    }
  }
}

// export const uploadWL = async (data: any[], name: string, type: string, price: string, limit: string) => {
//   try {
//     const response = await axiosInstance.post(`${process.env.NEXT_PUBLIC_API_URL}api/wl/bulk-add`, {
//       data: data,
//       name: name,
//       type: type,
//       price: price,
//       limit: limit
//     })

//     if (response.status === 403) {
//       return {
//         success: false,
//         error: 403
//       }
//     }
//     else {
//       return response.data
//     }
//   }
//   catch (error) {
//     return {
//       success: false,
//       error: error
//     }
//   }
// }

