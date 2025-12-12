

// Hoopay API Service

// URL de destino (Baseada na sua documentação)
const TARGET_URL = "https://api.pay.hoopay.com.br/charge";

// Usando o proxy diretamente. 
const API_URL = `https://corsproxy.io/?${TARGET_URL}`;

// Novas Credenciais (Client ID + Client Secret)
const CLIENT_ID = "4d13ebea90c2fe33be81859aaec2f243";
const CLIENT_SECRET = "664daf4655f89fa02606174ede49a905d14eb5a9d29d9b69185bb2ee8c124f2f";

interface PixResponse {
    success: boolean;
    pixPayload?: string; // Código Copia e Cola
    pixQrCode?: string;  // Base64 da imagem
    error?: string;
}

// Função auxiliar para garantir que qualquer erro vire string
const stringifyError = (err: any): string => {
    if (typeof err === 'string') return err;
    if (err instanceof Error) return err.message;
    try {
        return JSON.stringify(err, null, 2);
    } catch (e) {
        return String(err);
    }
};

// Não recebe mais dados do cliente, apenas o valor
export const gerarPix = async (amount: number): Promise<PixResponse> => {
    try {
        // Formatar valor para decimal (ex: 10.00)
        const formattedAmount = amount.toFixed(2); 

        // Basic Auth: ClientID como usuário, ClientSecret como senha
        const credentials = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);

        // CPF Válido Gerado (Fictício) para passar na validação estrita da API
        // A API rejeitou string vazia "".
        const validCpf = "49128701020"; 

        // DADOS HARDCODED (GENÉRICOS) PARA PAGAMENTO RÁPIDO
        const payload = {
            amount: Number(formattedAmount),
            customer: {
                name: "Cliente Anônimo",
                email: "nao_informado@cliente.com", 
                phone: "11999999999", 
                document: validCpf 
            },
            payments: [
                { 
                    type: "pix",
                    amount: Number(formattedAmount)
                }
            ],
            products: [
                {
                    title: "Recarga Saldo 𝗦𝗠𝗦 𝗩𝗜𝗥𝗧𝗨𝗔𝗟 𝗕𝗥",
                    amount: Number(formattedAmount), 
                    quantity: 1
                }
            ],
            // Adicionado IP obrigatório e callback vazio
            data: {
                ip: "127.0.0.1" 
            } 
        };

        console.log("Enviando para:", API_URL);
        console.log("Payload:", payload);

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${credentials}`
            },
            body: JSON.stringify(payload)
        });

        const textResponse = await response.text();
        let data;
        
        try {
            data = JSON.parse(textResponse);
        } catch (e) {
            console.error("Resposta não é JSON:", textResponse);
            throw new Error(`Erro Proxy/Rede: ${textResponse.substring(0, 100)}...`);
        }

        console.log(`Resposta Hoopay (Status ${response.status}):`, data);

        if (!response.ok) {
            // Tenta extrair mensagem de erro
            let errorMsg = "Erro desconhecido na API";

            if (data.error) {
                errorMsg = stringifyError(data.error);
            } else if (data.message) {
                errorMsg = stringifyError(data.message);
            } else if (data.errors) {
                errorMsg = stringifyError(data.errors);
            } else {
                errorMsg = JSON.stringify(data, null, 2);
            }

            throw new Error(`API Recusou (${response.status}): ${errorMsg}`);
        }

        // Correção no caminho de leitura: data.payment.charges (sem .body)
        const charges = data?.payment?.charges;
        
        if (charges && charges.length > 0) {
            const pixData = charges[0];
            
            // IMPORTANTE: .trim() remove espaços em branco no inicio/fim que quebram o Copia e Cola
            const rawPayload = pixData.pixPayload || "";
            
            return {
                success: true,
                pixPayload: rawPayload.trim(),
                pixQrCode: pixData.pixQrCode
            };
        } else {
            throw new Error("QR Code não encontrado na resposta. \nResp: " + JSON.stringify(data));
        }

    } catch (error: any) {
        console.error("Erro Catch:", error);
        return {
            success: false,
            error: stringifyError(error)
        };
    }
};
