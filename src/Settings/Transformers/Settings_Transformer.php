<?php

namespace PM\Settings\Transformers;

use PM\Settings\Models\Settings;
use League\Fractal\TransformerAbstract;
use PM\Common\Traits\Resource_Editors;

class Settings_Transformer extends TransformerAbstract {

    use Resource_Editors;

    protected $availableIncludes = [
        'creator', 'updater'
    ];

    public function transform( Settings $item ) {
        return [
            'id'         => (int) $item->id,
            'key'        => $item->key,
            'value'      => $item->value,
            'created_at' => format_date( $item->created_at ),
        ];
    }
}