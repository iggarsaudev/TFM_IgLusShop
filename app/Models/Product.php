<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    /** @use HasFactory<\Database\Factories\ProductFactory> */
    use HasFactory;

    protected $fillable = ['name', 'description', 'price', 'stock', 'image','has_discount','discount','provider_id','category_id'];

    public function categoria()
    {
        return $this->belongsTo(Category::class);
    }

    public function detallesPedido()
    {
        return $this->hasMany(OrderDetails::class);
    }

    public function proveedor()
    {
        return $this->hasOne(Provider::class);
    }
}
