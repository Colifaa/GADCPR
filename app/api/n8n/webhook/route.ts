import { NextRequest, NextResponse } from 'next/server';

// Función para validar el formato de datos de n8n
function validateN8nData(data: any) {
  const requiredFields = ['status', 'generatedText', 'sentimentScore', 'sentimentLabel'];
  const optionalFields = ['explanation', 'content'];
  const missingFields: string[] = [];
  
  // Verificar campos requeridos
  for (const field of requiredFields) {
    if (!(field in data)) {
      missingFields.push(field);
    }
  }
  
  if (missingFields.length > 0) {
    console.error('❌ Faltan campos requeridos:', missingFields);
    return { isValid: false, missingFields };
  }
  
  // Validar tipos de datos básicos
  if (typeof data.status !== 'string') {
    console.error('❌ El campo "status" debe ser string');
    return { isValid: false, error: 'status debe ser string' };
  }
  
  if (typeof data.sentimentScore !== 'number') {
    console.error('❌ El campo "sentimentScore" debe ser number');
    return { isValid: false, error: 'sentimentScore debe ser number' };
  }
  
  if (typeof data.sentimentLabel !== 'string') {
    console.error('❌ El campo "sentimentLabel" debe ser string');
    return { isValid: false, error: 'sentimentLabel debe ser string' };
  }
  
  console.log('✅ Validación exitosa. Campos encontrados:', Object.keys(data));
  return { isValid: true };
}

export async function POST(request: NextRequest) {
  try {
    // Leer el body de la request
    const body = await request.json();
    
    console.log('📦 Datos recibidos de n8n:', body);
    
    // Validar que los datos tengan el formato esperado
    const validation = validateN8nData(body);
    if (!validation.isValid) {
      console.error('❌ Formato de datos inválido:', body);
      
      let errorMessage = 'Formato de datos inválido.';
      if (validation.missingFields) {
        errorMessage += ` Faltan campos requeridos: ${validation.missingFields.join(', ')}`;
      } else if (validation.error) {
        errorMessage += ` ${validation.error}`;
      }
      
      return NextResponse.json(
        { 
          success: false, 
          error: errorMessage,
          receivedFields: Object.keys(body),
          requiredFields: ['status', 'generatedText', 'sentimentScore', 'sentimentLabel'],
          optionalFields: ['explanation', 'content']
        },
        { status: 400 }
      );
    }

    // Los datos vienen con el formato correcto, los guardamos en localStorage (servidor)
    // Nota: En el server-side, necesitamos manejar esto diferente
    // Por simplicidad, vamos a retornar los datos para que el cliente los procese
    
    console.log('✅ Datos validados correctamente');
    
    // Respuesta exitosa
    return NextResponse.json({
      success: true,
      message: 'Datos recibidos y procesados correctamente',
      data: {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
        receivedData: body
      }
    });

  } catch (error) {
    console.error('❌ Error procesando webhook de n8n:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Endpoint de webhook de n8n funcionando correctamente',
    methods: ['POST'],
    requiredFields: {
      status: 'string - Estado del procesamiento (ej: "COMPLETED")',
      generatedText: 'string - Texto generado por n8n',
      sentimentScore: 'number - Puntuación de sentimiento (-1 a 1)',
      sentimentLabel: 'string - Etiqueta de sentimiento (ej: "POSITIVE")'
    },
    optionalFields: {
      explanation: 'any - Explicación del procesamiento',
      content: 'object - Contenido adicional con metadata'
    },
    examplePayload: {
      status: "COMPLETED",
      generatedText: "Texto generado...",
      sentimentScore: 0.9,
      sentimentLabel: "POSITIVE",
      content: {
        title: "Título del contenido",
        creator: "Creador",
        genre: "Género"
      }
    }
  });
}

// Opcional: Manejar otros métodos HTTP
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
} 