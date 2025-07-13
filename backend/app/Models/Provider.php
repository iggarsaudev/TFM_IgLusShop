<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Provider extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'description'];

    public function producto()
    {
        return  $this->belongsTo(Product::class);
    }
    public $timestamps = false;

}
