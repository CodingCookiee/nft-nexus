import abi from '../abi/abi.json'


const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

// Read Contract Functions
export const getTokenName = async (publicClient) => {
    try {

        const data = await publicClient.readContract({
            address: CONTRACT_ADDRESS ,
            abi,
            functionName: 'name'
        });

        return data
        
    } catch (error) {
        console.error("Error fetching token name:", error);
        throw error;
    }
    
}

export const getTokenSymbol = async (publicClient) => {
    try {

        const data = await publicClient.readContract({
            address: CONTRACT_ADDRESS ,
            abi,
            functionName: 'symbol'
        });

        return data
        
    } catch (error) {
        console.error("Error fetching token symbol:", error);
        throw error;
    }
    
}

export const getTokenDecimals = async (publicClient) => {
    try {

        const data = await publicClient.readContract({
            address: CONTRACT_ADDRESS,
            abi,
            functionName: 'decimals'
        });

        return data
        
    } catch (error) {
        console.error("Error fetching token decimals:", error);
        throw error;
    }
    
}

export const getTotalSupply = async (publicClient) => {
    try {

        const data = await publicClient.readContract({
            address: CONTRACT_ADDRESS,
            abi,
            functionName: 'totalSupply'
        });

        return data
        
    } catch (error) {
        console.error("Error fetching total supply:", error);
        throw error;
    }
    
}

export const getOwner = async (publicClient) => {
    try {

        const data = await publicClient.readContract({
            address: CONTRACT_ADDRESS,
            abi,
            functionName: 'owner'
        });

        return data
        
    } catch (error) {
        console.error("Error fetching contract owner:", error);
        throw error;
    }
    
}

export const getBalanceOf = async (publicClient, address) => {
if(!address) throw new Error('Address is required')

    try {

        const data = await publicClient.readContract({
            address: CONTRACT_ADDRESS,
            abi,
            functionName: 'balanceOf',
            args:[address]
        });

        return data
        
    } catch (error) {
        console.error("Error fetching balance:", error);
        throw error;
    }
    
}


export const getAllowance = async (publicClient, owner, spender) => {
    if(!owner || !spender) throw new Error('Owner and spender addresses are required')
    
        try {
    
            const data = await publicClient.readContract({
                address: CONTRACT_ADDRESS,
                abi,
                functionName: 'allowance',
                args:[owner, spender]
            });
    
            return data
            
        } catch (error) {
            console.error("Error fetching allowance:", error);
            throw error;
        }
        
    }

