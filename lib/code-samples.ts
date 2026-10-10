// Display-only snippets: each block shows a single language (C# in Development, SQL in Data).

export const CODE_CS = `public sealed class FacturaService(AppDbContext db, ISriClient sri)
{
    public async Task<Result<Factura>> EmitirAsync(Pedido pedido)
    {
        var cliente = await db.Clientes.FindAsync(pedido.ClienteId);
        if (cliente is null)
            return Result.Fail<Factura>("El cliente no existe");

        var factura = Factura.Desde(pedido, cliente, iva: 0.15m);
        db.Facturas.Add(factura);

        await sri.AutorizarAsync(factura);
        await db.SaveChangesAsync();

        return Result.Ok(factura);
    }
}`

export const CODE_SQL = `SELECT  p.nombre                    AS producto,
        SUM(m.cantidad)             AS stock,
        MAX(m.fecha)                AS ultimo_movimiento
FROM    movimientos m
JOIN    productos   p ON p.id = m.producto_id
WHERE   m.bodega_id = @bodega
GROUP BY p.nombre
HAVING  SUM(m.cantidad) < 10
ORDER BY stock ASC;`
