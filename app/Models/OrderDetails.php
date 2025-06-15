<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderDetails extends Model
{
    /** @use HasFactory<\Database\Factories\OrderDetailsFactory> */
    use HasFactory;

    protected $fillable = ['order_id', 'product_id', 'quantity', 'unit_price'];

    public function pedido()
    {
        return $this->belongsTo(Order::class);
    }

    public function producto()
    {
        return $this->belongsTo(Product::class);
    }
}
