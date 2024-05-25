import { NextResponse } from 'next/server';
import connect from '@/utils/db';

export const GET = async (request, res) => {
    try {
        console.log('Iniciando conexión a MongoDB...');
        await connect();
        console.log('Conexión a MongoDB exitosa.');

        return new NextResponse(JSON.stringify('API funcionaa'), { status: 200 });
    } catch (error) {
        console.error('Error al conectar a MongoDB:', error);
        return new NextResponse(JSON.stringify('Error al conectar a MongoDB'), { status: 500 });
    }
};
